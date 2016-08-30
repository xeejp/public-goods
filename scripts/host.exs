defmodule PublicGoods.Host do
  alias PublicGoods.Main
  alias PublicGoods.Actions

  # Actions
  def fetch_contents(data) do
    data
    |> Actions.update_host_contents()
  end

  def change_page(data, page) do
    if page in Main.pages do
      if page == "result" do
        ranking = Enum.map(data.participants, fn {id, p} ->
          {id, Enum.sum(p.profits)}
        end) |> Enum.into(%{})
        data = %{data | ranking: ranking}
      end
      %{data | page: page}
      |> Actions.change_page(page)
    else
      data
    end
  end

  def match(data) do
    %{participants: participants, group_size: group_size, money: money} = data

    groups_count = div(Map.size(participants), group_size)
    groups = participants
              |> Enum.map(&elem(&1, 0)) # [id...]
              |> Enum.shuffle
              |> Enum.map_reduce(0, fn(p, acc) -> {{acc, p}, acc + 1} end) |> elem(0) # [{0, p0}, ..., {n-1, pn-1}]
              |> Enum.group_by(fn {i, p} -> Integer.to_string(min(div(i, group_size), groups_count-1)) end, fn {i, p} -> p end) # %{0 => [p0, pm-1], ..., l-1 => [...]}

    updater = fn participant, group ->
      %{ participant |
        voted: false,
        group: group,
        money: money,
        profits: [],
        invested: false,
        investment: 0,
        punished: false,
        punishment: [],
        punishments: []
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

    %{data | participants: participants, groups: groups, investment_log: []}
    |> Actions.matched()
  end

  # Utilities
  def format_contents(data) do
    data
    |> Map.pop(:investment_log)
    |> (fn {log, data} -> Map.put(data, "investmentLog", log) end).()
  end
end
