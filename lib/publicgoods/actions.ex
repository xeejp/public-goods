defmodule PublicGoods.Actions do
  alias PublicGoods.Participant
  alias PublicGoods.Host

  def update_host_contents(data) do
    host = get_action("update contents", Host.filter_data(data))
    format(data, host)
  end

  def update_participant_contents(data, id) do
    participant = dispatch_to(id, get_action("update contents", Participant.format_contents(data, id)))
    format(data, nil, participant)
  end

  # Utilities

  defp get_action(type, params) do
    %{
      type: type,
      payload: params
    }
  end

  defp dispatch_to(map \\ %{}, id, action) do
    Map.put(map, id, %{action: action})
  end

  defp dispatch_to_all(%{participants: participants}, action) do
    Enum.reduce(participants, %{}, fn {id, _}, acc -> dispatch_to(acc, id, action) end)
  end

  defp format(data, host, participants \\ nil) do
    result = %{data: data}
    unless is_nil(host) do
      result = Map.put(result, :host, %{action: host})
    end
    unless is_nil(participants) do
      result = Map.put(result, :participant, participants)
    end
    {:ok, result}
  end
end
