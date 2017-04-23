defmodule PublicGoods.Participant do
  alias PublicGoods.Actions

  @after_compile __MODULE__

  def filter_data(data, id) do
    rule = %{
      rounds: true,
      page: true,
      punishment: true,
      punishment_rate: "punishmentRate",
      max_punishment: "maxPunishment",
      investment_log: "investmentLog",
      money: true,
      roi: true,
      participants: %{id => true},
      _spread: [[:participants, id]]
    }
    %{participants: participants, groups: groups} = data
    participant = Map.get(participants, id)
    group = if not is_nil(participant.group) do
      format_group(data, Map.get(groups, participant.group), id)
    else
      %{}
    end
    data
    |> Transmap.transform(rule)
    |> Map.put(:joined, Map.size(data.participants))
    |> Map.put(:ranking, Enum.map(data.ranking, fn {key, profit} ->
      %{profit: profit, own: key == id}
    end))
    |> Map.merge(group)
  end

  def __after_compile__(env, _bytecode) do
    IO.inspect "PublicGoods compiled"
  end

  # Actions
  def fetch_contents(data, id) do
    Actions.update_participant_contents(data, id)
  end

  def invest(data, id, investment) do
    # assert that a participant have not invested
    false = get_in(data, [:participants, id, :invested])
    data = data
           |> put_in([:participants, id, :invested], true)
           |> put_in([:participants, id, :investment], investment)

    group_id = get_in(data, [:participants, id, :group])
    # assert that the state of a group is not finished
    true = get_in(data, [:groups, group_id, :state]) != "finished"
    members = get_in(data, [:groups, group_id, :members])

    if Enum.all?(members, fn id -> get_in(data, [:participants, id, :invested]) end) do
      investments_sum = Enum.reduce(members, 0, fn id, acc ->
        acc + get_in(data, [:participants, id, :investment])
      end)
      data
      |> put_in([:groups, group_id, :investments], Enum.map(data.groups[group_id].members, fn id ->
        %{id: id, investment: get_in(data, [:participants, id, :investment])}
      end))
      |> put_in([:groups, group_id, :state], "investment_result")
      |> Map.update!(:participants, fn participants ->
        Enum.reduce(members, participants, fn id, participants ->
          participant = participants[id]
          private = participant.money - participant.investment
          public = investments_sum * data.roi
          update_in(participants, [id, :profits], fn profits ->
            new_profit = private + public
            [new_profit | profits]
          end)
        end)|> Enum.into(%{})
      end)
      |> Map.update!(:participants, fn participants ->
        Enum.reduce(members, participants, fn id, participants ->
          participant = participants[id]
          update_in(participants, [id, :invs], fn invs ->
            new_investment = participant.investment
            [new_investment | invs]
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
    else
      data
    end
  end

  def punish(data, id, punishment) do
    # assert that a participant have not punished
    false = get_in(data, [:participants, id, :punished])
    data = data
           |> put_in([:participants, id, :punished], true)
           |> put_in([:participants, id, :punishment], punishment)

    group_id = get_in(data, [:participants, id, :group])
    # assert that the state of a group is not finished
    true = get_in(data, [:groups, group_id, :state]) != "finished"
    members = get_in(data, [:groups, group_id, :members])

    if Enum.all?(members, fn id -> get_in(data, [:participants, id, :punished]) end) do
      punishments = members |> Enum.map(fn id -> {id, 0} end) |> Enum.into(%{})
      punishments_sum = Enum.reduce(members, punishments, fn id, punishments ->
        get_in(data, [:participants, id, :punishment])
        |> Enum.reduce(punishments, fn {id, point}, punishments ->
          Map.update!(punishments, id, &(&1 + point))
        end)
      end)
      data
      |> put_in([:groups, group_id, :state], "punishment_result")
      |> Map.update!(:participants, fn participants ->
        Enum.reduce(members, participants, fn id, participants ->
          participant = participants[id]
          update_in(participants, [id, :punishments], fn punishments ->
            [punishments_sum[id] | punishments]
          end)
          |> update_in([id, :used], fn used ->
            sum = Enum.reduce(participant.punishment, 0, fn {_id, p}, acc ->
              p + acc
            end)
            [sum | used]
          end)
        end) |> Enum.into(%{})
      end)
      |> Map.update!(:punishment_log, fn log ->
        [%{
          group_id: group_id,
          round: get_in(data, [:groups, group_id, :round]),
          punishments: Enum.map(members, fn id ->
            get_in(data, [:participants, id, :punishment])
          end)
        } | log]
      end)
    else
      data
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
    else
      group = Map.update!(group, :not_voted, fn x -> x - 1 end)
      data
      |> put_in([:groups, group_id], group)
    end
  end

  # Utilities
  def format_group(data, group, id) do
    %{participants: participants} = data
    %{
      members: length(group.members),
      memberID: Enum.find_index(group.members, fn x -> x == id end),
      investments: group.investments,
      round: group.round,
      state: group.state,
      votesNext: length(group.members) - group.not_voted
    }
  end

  def format_contents(data, id) do
    filter_data(data, id)
  end
end
