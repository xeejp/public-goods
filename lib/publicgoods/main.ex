defmodule PublicGoods.Main do
  alias PublicGoods.Actions

  @pages ["waiting", "description", "experiment", "result"]
  @states ["investment", "investment_result", "punishment", "punishment_result", "finished"]

  def pages, do: @pages
  def states, do: @states

  def init do
    %{
      ranking: [],
      page: "waiting",
      participants: %{},
      groups: %{},
      punishment: false,
      investment_log: [],
      money: 100,
      roi: 0.4, # Return on Investment
      rounds: 2,
      group_size: 4, # Number of members
      joined: 0
    }
  end

  def new_participant do
    %{
      group: nil,
      money: 0,
      profits: [],
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
      round: 0,
      state: "investment",
      not_voted: length(members)
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
