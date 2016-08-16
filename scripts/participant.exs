defmodule PublicGoods.Participant do
  alias PublicGoods.Actions

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
      profit = Enum.reduce(members, 0, fn id, acc ->
        acc + get_in(data, [:participants, id, :investment])
      end)
      data
      |> put_in([:groups, group_id, :state], "investment_result")
      |> put_in([:groups, group_id, :profit], profit)
      |> Actions.investment_result(group_id, id, investment, profit)
    else
      Actions.invest(data, id)
    end
  end

  # Utilities
  def format_group(group) do
    %{
      members: length(group.members),
      counter: group.counter,
      state: group.state,
      profit: group.profit
    }
  end

  def format_participant(participant), do: participant

  def format_data(data) do
    %{
      page: data.page,
      punishment: data.punishment,
      money: data.money,
      roi: data.roi
    }
  end

  def format_contents(data, id) do
    %{participants: participants, groups: groups} = data
    participant = Map.get(participants, id)
    if not is_nil(participant.group) do
      format_participant(participant)
      |> Map.merge(format_group(Map.get(groups, participant.group)))
      |> Map.merge(format_data(data))
    else
      format_participant(participant)
    end
  end
end
