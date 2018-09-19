defmodule PublicGoods.Host do
  alias PublicGoods.Main

  defp ensure_integer(integer) when is_integer(integer), do: integer
  defp ensure_integer(str), do: Integer.parse(str) |> elem(0)
  defp ensure_float(float) when is_float(float), do: float
  defp ensure_float(str), do: Float.parse(str) |> elem(0)

  def update_config(data, config) do
    data = Map.put(data, :roi, ensure_float(config["roi"]))
            |> Map.put(:money, ensure_integer(config["money"]))
            |> Map.put(:punishment_flag, config["punishmentFlag"])
            |> Map.put(:max_punishment, ensure_integer(config["maxPunishment"]))
            |> Map.put(:punishment_rate, ensure_integer(config["punishmentRate"]))
            |> Map.put(:group_size, ensure_integer(config["groupSize"]))
            |> Map.put(:max_round, ensure_integer(config["maxRound"]))
            |> Map.put(:ask_student_id, config["askStudentId"])
  end

  def update_description(data, description) do
    data = Map.put(data, :description, description)
  end

  def change_page(data, page) do
    data = if data.page == "waiting" && page == "description" do
      data
            |> Map.put(:investment_log, [])
            |> Map.put(:punishment_log, [])
            |> Map.put(:history, [])
            |> Map.put(:profits_data, [])
            |> match()
    else
      data
    end
    data = Map.update!(data, :page, fn _ -> page end)
    case page do
      "waiting" -> Map.update!(data, :joinable, fn _ -> true end)
                    |> Map.update!(:active_participants_number, fn _ -> data.participants_number end)
      _ -> data
    end
  end

  def visit(data) do
    Map.put(data, :is_first_visit, false)
  end

  def match(data) do
    %{participants: participants, group_size: group_size} = data

    groups_number = round(Float.ceil(Map.size(participants)/group_size))
    groups = participants
              |> Enum.map(&elem(&1, 0)) # [id...]
              |> Enum.shuffle
              |> Enum.map_reduce(0, fn(p, acc) -> {{acc, p}, acc + 1} end) |> elem(0) # [{0, p0}, ..., {n-1, pn-1}]
              |> Enum.group_by(fn {i, p} -> Integer.to_string(div(i, group_size)) end, fn {i, p} -> p end) # %{0 => [p0, pm-1], ..., l-1 => [...]}

    updater = fn participant, group ->
      %{ participant |
        group: group,
        is_finish_description: false,
        invs: [],
        profits: [],
        punishments: [],
        used: [],
        invested: false,
        investment: 0,
        punished: false,
        punishment: 0,
        voted: false
      }
    end
    reducer = fn {group, ids}, {participants, groups} ->
      participants = Enum.reduce(ids, participants, fn id, participants ->
        Map.update!(participants, id, &updater.(&1, group))
      end)
      groups = Map.put(groups, group, Main.new_group(ids))
      {participants, groups}
    end
    acc = {participants, %{}}
    {participants, groups} = Enum.reduce(groups, acc, reducer)

    %{data | participants: participants, groups: groups, groups_number: groups_number, active_participants_number: data.participants_number, joinable: false }
  end

  def get_filter(data) do
    map = %{
      _default: true,
      is_first_visit: "isFirstVisit",
      participants_number: "participantsNumber",
      active_participants_number: "activeParticipantsNumber",
      finish_description_number: "finishDescriptionNumber",
      groups_number: "groupsNumber",
      group_size: "groupSize",
      ask_student_id: "askStudentId",
      punishment_flag: "punishmentFlag",
      max_punishment: "maxPunishment",
      max_round: "maxRound",
      punishment_rate: "punishmentRate"
    }
  end

  def filter_data(data) do
    Transmap.transform(data, get_filter(data), diff: false)
  end
end
