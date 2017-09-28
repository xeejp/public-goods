defmodule PublicGoods.Main do
  alias PublicGoods.Host
  alias PublicGoods.Participant

  require Logger

  def init do
    %{
      is_first_visit: true,      
      page: "waiting", 
      joinable: true,
      description: nil,
      groups: %{},
      participants: %{},
      participants_number: 0,
      active_participants_number: 0,
      finish_description_number: 0,
      group_size: 4, # Number of members
      groups_number: 0,
      ask_student_id: false,

      punishment_flag: false,
      punishment_rate: 3,
      max_punishment: 30,
      investment_log: [],
      punishment_log: [],
      money: 100,
      roi: 0.4,
      max_round: 2,
      profits_data: [],
      history: [],
      punish_history: [],
    }
  end

  def new_participant(uid) do
    %{
      is_finish_description: false,
      id: nil,
      uid: uid,  
      invs: [],
      profits: [],
      group: nil,
      punishments: [],
      used: [],
      invested: false,
      investment: 0,
      punished: false,
      punishment: 0,
      voted: false
    }
  end

  def new_group(members) do
    %{
      members: members,
      group_status: "investment",      
      investments: [],
      not_voted: length(members),
      round: 0,
      voting: false,
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant(id)
      if data.page == "waiting" do
        data = Map.update!(data, :active_participants_number, fn n -> n + 1 end)
      end

      data
      |> put_in([:participants, id], new)
      |> Map.update!(:participants_number, fn n -> n + 1 end)
    else
      data
    end
  end

  def compute_diff(old, %{data: new} = result) do
    import Participant, only: [filter_data: 2]
    import Host, only: [filter_data: 1]

    host = Map.get(result, :host, %{})
    participant = Map.get(result, :participant, %{})
    participant_tasks = Enum.map(old.participants, fn {id, _} ->
      {id, Task.async(fn -> JsonDiffEx.diff(filter_data(old, id), filter_data(new, id)) end)}
    end)
    host_task = Task.async(fn -> JsonDiffEx.diff(filter_data(old), filter_data(new)) end)
    host_diff = Task.await(host_task)
    participant_diff = Enum.map(participant_tasks, fn {id, task} -> {id, %{diff: Task.await(task)}} end)
                        |> Enum.filter(fn {_, map} -> map_size(map.diff) != 0 end)
                        |> Enum.into(%{})
    host = Map.merge(host, %{diff: host_diff})
    host = if map_size(host.diff) == 0 do
      Map.delete(host, :diff)
    else
      host
    end
    host = if map_size(host) == 0 do
      nil
    else
      host
    end
    participant = Map.merge(participant, participant_diff, fn _k, v1, v2 ->
      Map.merge(v1, v2)
    end)
    %{data: new, host: host, participant: participant}
  end
end
