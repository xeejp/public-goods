defmodule PublicGoods.Participant do
  alias PublicGoods.Actions

  # Actions
  def fetch_contents(data, id) do
    Actions.update_participant_contents(data, id)
  end

  # Utilities
  def format_group(group) do
    %{
      counter: group.counter,
      state: group.state
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
