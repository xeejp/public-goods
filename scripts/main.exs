defmodule PublicGoods.Main do
  alias PublicGoods.Actions

  @pages ["waiting", "description", "experiment", "result"]
  @states ["investing", "result", "punishment", "punishment_result"]

  def pages, do: @pages
  def states, do: @states

  def init do
    %{
      page: "waiting",
      participants: %{},
      groups: %{},
      punishment: false,
      money: 1000,
      roi: 2, # Return on Investment
      group_size: 4 # Number of members
    }
  end

  def new_participant do
    %{
      group: nil,
      money: 0,
      profit: 0,
      invested: false,
      investment: 0,
      punished: false,
      punishment: 0
    }
  end

  def new_group(members) do
    %{
      members: members,
      counter: 0,
      state: "investing",
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant()
      put_in(data, [:participants, id], new)
      |> Actions.join(id, new)
    else
      data
    end
  end

  def wrap(data) do
    {:ok, %{"data" => data}}
  end
end
