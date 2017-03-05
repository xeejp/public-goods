defmodule PublicGoods.Participant do
  alias PublicGoods.Actions

  @after_compile __MODULE__

  def __after_compile__(env, _bytecode) do
    IO.inspect "PublicGoods compiled"
  end

  # Actions
  def fetch_contents(data, id) do
    Actions.update_participant_contents(data, id)
  end

  def invest(data, id, investment) do
    data = data
            |> put_in([:participants, id, :invested], true)
            |> put_in([:participants, id, :investment], investment)

    group_id = get_in(data, [:participants, id, :group])
    members = get_in(data, [:groups, group_id, :members])

    if Enum.all?(members, fn id -> get_in(data, [:participants, id, :invested]) end) do
      investments_sum = Enum.reduce(members, 0, fn id, acc ->
        acc + get_in(data, [:participants, id, :investment])
      end)
      data
      |> put_in([:groups, group_id, :state], "investment_result")
      |> Map.update!(:participants, fn participants ->
        Enum.reduce(members, participants, fn id, participants ->
          participant = participants[id]
          update_in(participants, [id, :profits], fn profits ->
            new_profit = Float.floor(investments_sum * data.roi) - participant.investment
            [new_profit | profits]
          end)
        end) |> Enum.into(%{})
      end)
      |> Map.update!(:investment_log, fn log ->
        [%{
          group_id: group_id,
          round: get_in(data, [:groups, group_id, :round]),
          investments: Enum.map(members, fn id ->
            get_in(data, [:participants, id, :investment])
          end)
        } | log]
      end)
      |> Actions.investment_result(group_id, id, investment)
    else
      Actions.invest(data, id)
    end
  end

  def vote_next(data, id) do
    participant = get_in(data, [:participants, id])
    false = participant.voted # Ensure that the participant has not been voted.
    data = put_in(data, [:participants, id, :voted], true)
    group_id = participant.group
    group = get_in(data, [:groups, group_id])

    if group.not_voted == 1 do
      group = Map.update!(group, :not_voted, fn x ->
        length(group.members)
      end)

      now_group_round = group.round
      group = case group.state do
        "investment_result" ->
          if data.punishment do
            Map.put(group, :state, "punishment")
          else
            if data.rounds == group.round + 1 do
              Map.put(group, :state, "finished")
            else
              group
              |> Map.put(:state, "investment")
              |> Map.update!(:round, fn round -> round + 1 end)
            end
          end
        "punishment_result" ->
          if data.rounds == group.round + 1 do
            Map.put(group, :state, "finished")
          else
            group
            |> Map.put(:state, "investment")
            |> Map.update!(:round, fn round -> round + 1 end)
          end
      end
      participants = Enum.reduce(group.members, data.participants, fn (id, acc) ->
        Map.update!(acc, id, fn participant ->
          %{ participant |
            voted: false,
            invested: data.rounds == now_group_round + 1,
            investment: 0,
            punished: false,
            punishment: 0,
          }
        end)
      end)
      data
      |> put_in([:groups, group_id], group)
      |> Map.put(:participants, participants)
      |> Actions.change_state(group_id)
    else
      group = Map.update!(group, :not_voted, fn x -> x - 1 end)
      data
      |> put_in([:groups, group_id], group)
      |> Actions.vote_next(group_id)
    end
  end

  def fetch_ranking(data, id) do
    data
    |> Actions.update_ranking(id)
  end

  # Utilities
  def format_group(data, group, id) do
    %{participants: participants} = data
    %{
      members: length(group.members),
      memberID: Enum.find_index(group.members, fn x -> x == id end),
      investments: investments = Enum.map(group.members, fn id ->
        get_in(participants, [id, :investment])
      end),
      round: group.round,
      state: group.state,
    }
  end

  def format_participant(participant), do: participant

  def format_data(data) do
    %{
      page: data.page,
      punishment: data.punishment,
      money: data.money,
      roi: data.roi,
      joined: Map.size(data.participants),
    }
  end

  def format_contents(data, id) do
    %{participants: participants, groups: groups} = data
    participant = Map.get(participants, id)
    if not is_nil(participant.group) do
      format_participant(participant)
      |> Map.merge(format_group(data, Map.get(groups, participant.group), id))
      |> Map.merge(format_data(data))
    else
      format_participant(participant)
      |> Map.merge(format_data(data))
    end
  end
end
