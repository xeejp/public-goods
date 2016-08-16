defmodule PublicGoods.Actions do
  alias PublicGoods.Participant
  alias PublicGoods.Host

  def change_page(data, page) do
    action = get_action("change page", page)
    format(data, nil, dispatch_to_all(data, action))
  end

  def join(data, id, participant) do
    action = get_action("join", %{id: id, participant: participant})
    format(data, action)
  end

  def matched(%{participants: participants, groups: groups} = data) do
    host = get_action("matched", %{participants: participants, groups: groups})
    participant = Enum.map(participants, fn {id, p} ->
      payload = Map.merge(Participant.format_participant(p), Participant.format_group(Map.get(groups, p.group)))
      {id, %{action: get_action("matched", payload)}}
    end) |> Enum.into(%{})
    format(data, host, participant)
  end

  def update_host_contents(data) do
    host = get_action("update contents", Host.format_contents(data))
    format(data, host)
  end

  def update_participant_contents(data, id) do
    participant = dispatch_to(id, get_action("update contents", Participant.format_contents(data, id)))
    format(data, nil, participant)
  end

  def invest(data, id) do
    investment = get_in(data, [:participants, id, :investment])
    host = get_action("invest", %{id: id, investment: investment})
    participant = dispatch_to(id, get_action("invest", investment))
    format(data, host, participant)
  end

  def investment_result(data, group_id, participant_id, investment, profit) do
    group = get_in(data, [:groups, group_id])
    host = get_action("investment result", %{
      participantID: participant_id, investment: investment,
      groupID: group_id, profit: profit
    })
    participants = data.participants
    investments = Enum.map(group.members, fn id ->
      get_in(participants, [id, :investment])
    end)
    participant = Enum.map(group.members, fn id -> {id, %{action:
      get_action("investment result", %{
        investment: investment, investments: investments, profit: profit
      })
    }} end) |> Enum.into(%{})
    format(data, host, participant)
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
    result = %{"data" => data}
    unless is_nil(host) do
      result = Map.put(result, "host", %{action: host})
    end
    unless is_nil(participants) do
      result = Map.put(result, "participant", participants)
    end
    {:ok, result}
  end
end
