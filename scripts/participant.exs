defmodule PublicGoods.Participant do
  alias PublicGoods.Actions

  # Actions
  def fetch_contents(data, id) do
    Actions.update_user_contents(data, id)
  end

  # Utilities
  def format_group(group) do
    %{
      count: group.count,
      state: group.state
    }
  end
end
