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
      payload = Map.merge(Participant.format_participant(p), Participant.format_group(data, Map.get(groups, p.group), id))
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

  def update_ranking(data, id) do
    ranking = Enum.map(data.ranking, fn {key, profit} ->
      %{profit: profit, own: key == id}
    end)
    action = get_action("update ranking", ranking)
    participant = dispatch_to(id, action)
    format(data, nil, participant)
  end

  def invest(data, id) do
    investment = get_in(data, [:participants, id, :investment])
    host = get_action("invest", %{id: id, investment: investment})
    participant = dispatch_to(id, get_action("invest", investment))
    format(data, host, participant)
  end

  def investment_result(data, group_id, participant_id, investment) do
    %{investment_log: investment_log} = data
    group = get_in(data, [:groups, group_id])
    host = get_action("investment result", %{
      participantID: participant_id, investment: investment,
      groupID: group_id, newLog: hd(investment_log)
    })
    participants = data.participants
    investments = Enum.map(group.members, fn id ->
      get_in(participants, [id, :investment])
    end)
    participant = Enum.map(group.members, fn id -> {id, %{action:
      get_action("investment result", %{
        investment: investment, investments: investments, newProfit: hd(get_in(participants, [id, :profits]))
      })
    }} end) |> Enum.into(%{})
    format(data, host, participant)
  end

  def punish(data, id) do
    punishment = get_in(data, [:participants, id, :punishment])
    host = get_action("punish", %{id: id, punishment: punishment})
    participant = dispatch_to(id, get_action("punish", punishment))
    format(data, host, participant)
  end

  def punishment_result(data, group_id, id, punishments) do
    group = get_in(data, [:groups, group_id])
    host = get_action("punishment result", %{
      participantID: id, punishments: punishments,
      groupID: group_id
    })
    participants = data.participants
    participant = Enum.map(group.members, fn id -> 
      punishments = get_in(participants, [id, :punishments])
      action = get_action("punishment result", %{
        newPunishment: hd(punishments), newProfit: hd(get_in(participants, [id, :profits]))
      })
      {id, %{action: action}}
    end) |> Enum.into(%{})
    format(data, host, participant)
  end

  def vote_next(data, group_id) do
    group = get_in(data, [:groups, group_id])
    participant = Enum.reduce(group.members, %{}, fn (id, acc) ->
      action = get_action("vote next", %{
        notVoted: group.not_voted
      })
      dispatch_to(acc, id, action)
    end)
    format(data, nil, participant)
  end

  def change_state(data, group_id) do
    group = get_in(data, [:groups, group_id])
    host = get_action("change state", %{
      groupID: group_id,
      state: group.state,
      round: group.round,
      members: Enum.map(group.members, fn id -> Map.get(data.participants, id) end)
    })
    participant = Enum.reduce(group.members, %{}, fn (id, acc) ->
      p = Map.get(data.participants, id)
      payload = Map.merge(Participant.format_participant(p), %{
        state: group.state
      })
      action = get_action("change state", payload)
      dispatch_to(acc, id, action)
    end)
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
