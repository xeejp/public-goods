defmodule PublicGoods.Participant do
	require Logger
	def finish_description(data, id) do
		data = update_in(data, [:participants, id, :is_finish_description], fn _ -> true end)
		Map.put(data, :finish_description_number, Enum.count(data.participants, &(elem(&1, 1).is_finish_description)))
	end

	def update_snum(data, id, snum) do
		update_in(data, [:participants, id, :id], fn _ -> snum end)
	end

	def invest(data, id, investment) do
		# assert that a participant have not invested
		false = get_in(data, [:participants, id, :invested])
		data = data
			   |> put_in([:participants, id, :invested], true)
			   |> put_in([:participants, id, :investment], investment)
	
		group_id = get_in(data, [:participants, id, :group])
		group = get_in(data, [:groups, group_id])			
		# assert that the state of a group is not finished
		true = get_in(data, [:groups, group_id, :group_status]) != "finished"
		members = get_in(data, [:groups, group_id, :members])
		history = %{
			id: id,
			investment: investment,
			group_id: group_id,
			round: group.round,
		}
		data = Map.put(data, :history, [history] ++ data.history)		
	
		if Enum.all?(members, fn id -> get_in(data, [:participants, id, :invested]) end) do
		  investments_sum = Enum.reduce(members, 0, fn id, acc ->
			acc + get_in(data, [:participants, id, :investment])
			end)
			data = data
      |> put_in([:groups, group_id, :not_voted], length(group.members))			
		  |> put_in([:groups, group_id, :investments], Enum.map(data.groups[group_id].members, fn id ->
			%{id: id, investment: get_in(data, [:participants, id, :investment])}
		  end))
			|> put_in([:groups, group_id, :group_status], "investment_result")
			|> put_in([:groups, group_id, :voting], true)
		  |> Map.update!(:participants, fn participants ->
			Enum.reduce(members, participants, fn id, participants ->
			  participant = participants[id]
			  private = data.money - participant.investment
			  public = investments_sum * data.roi
			  update_in(participants, [id, :profits], fn profits ->
				new_profit = private + public
				[new_profit | profits]
			  end)
			end)|> Enum.into(%{})
		  end)
		  |> Map.update!(:participants, fn participants ->
			Enum.reduce(members, participants, fn id, participants ->
			  participant = participants[id]
			  update_in(participants, [id, :invs], fn invs ->
				new_investment = participant.investment
				[new_investment | invs]
			  end)
			end) |> Enum.into(%{})
		  end)
		  |> Map.update!(:investment_log, fn log ->
			[%{
			  group_id: group_id,
			  round: get_in(data, [:groups, group_id, :round]),
			  investments: Enum.map(members, fn id ->
				get_in(data, [:participants, id, :investment])
			  end)
			} | log]
			end)
			
			if data.max_round == group.round + 1 && !data.punishment_flag do
				data = Enum.reduce(group.members, data, fn id, acc ->
					Map.put(acc,:profits_data, [%{
						profits: data.participants[id].profits,
						punishments: data.participants[id].punishments,
						used: data.participants[id].used
					}] ++ acc.profits_data)
				end)
			end
			data
		else
			group = Map.update!(group, :not_voted, fn x -> x - 1 end)
      data
      |> put_in([:groups, group_id], group)
		end
	end

	def punish(data, id, punishment) do
    # assert that a participant have not punished
    false = get_in(data, [:participants, id, :punished])
    data = data
           |> put_in([:participants, id, :punished], true)
           |> put_in([:participants, id, :punishment], punishment)

		group_id = get_in(data, [:participants, id, :group])
		group = get_in(data, [:groups, group_id])					
    # assert that the state of a group is not finished
    true = get_in(data, [:groups, group_id, :group_status]) != "finished"
		members = get_in(data, [:groups, group_id, :members])
		histories = Enum.reduce(members, [], fn to_id, acc ->
			if(to_id == id) do
				acc
			else
				[%{
					id: id,
					to_id: to_id,
					punishment: punishment[to_id],
					group_id: group_id,
					round: group.round,
				}]	++ acc
			end
		end)

		data = Map.put(data, :punish_history, [histories] ++ data.punish_history)		
		
    if Enum.all?(members, fn id -> get_in(data, [:participants, id, :punished]) end) do
      punishments = members |> Enum.map(fn id -> {id, 0} end) |> Enum.into(%{})
      punishments_sum = Enum.reduce(members, punishments, fn id, punishments ->
        get_in(data, [:participants, id, :punishment])
        |> Enum.reduce(punishments, fn {id, point}, punishments ->
          Map.update!(punishments, id, &(&1 + point))
        end)
      end)
			data = data
      |> put_in([:groups, group_id, :not_voted], length(group.members))			
			|> put_in([:groups, group_id, :group_status], "punishment_result")
			|> put_in([:groups, group_id, :voting], true)			
      |> Map.update!(:participants, fn participants ->
        Enum.reduce(members, participants, fn id, participants ->
          participant = participants[id]
          update_in(participants, [id, :punishments], fn punishments ->
            [punishments_sum[id] | punishments]
          end)
          |> update_in([id, :used], fn used ->
            sum = Enum.reduce(participant.punishment, 0, fn {_id, p}, acc ->
              p + acc
            end)
            [sum | used]
          end)
        end) |> Enum.into(%{})
      end)
      |> Map.update!(:punishment_log, fn log ->
        [%{
          group_id: group_id,
          round: get_in(data, [:groups, group_id, :round]),
          punishments: Enum.map(members, fn id ->
            get_in(data, [:participants, id, :punishment])
          end)
        } | log]
			end)
			
			if data.max_round == group.round + 1 do
				data = Enum.reduce(group.members, data, fn id, acc ->
					Map.put(acc,:profits_data, [%{
						profits: data.participants[id].profits,
						punishments: data.participants[id].punishments,
						used: data.participants[id].used
					}] ++ acc.profits_data)
				end)
			end
			data
    else
      group = Map.update!(group, :not_voted, fn x -> x - 1 end)
      data
      |> put_in([:groups, group_id], group)
    end
  end

	def vote_next(data, id) do
    participant = get_in(data, [:participants, id])
    false = participant.voted # Ensure that the participant has not been voted.
    data = put_in(data, [:participants, id, :voted], true)
    group_id = participant.group
		group = get_in(data, [:groups, group_id])
		
		if group.not_voted == 1 do
      group = Map.update!(group, :not_voted, fn x ->
        length(group.members)
      end)

      now_group_round = group.round
      group = case group.group_status do
        "investment_result" ->
          if data.punishment_flag do
            Map.put(group, :group_status, "punishment")
          else
            if data.max_round == group.round + 1 do
              Map.put(group, :group_status, "finished")
            else
              group
              |> Map.put(:group_status, "investment")
              |> Map.update!(:round, fn round -> round + 1 end)
            end
          end
        "punishment_result" ->
          if data.max_round == group.round + 1 do
            Map.put(group, :group_status, "finished")
          else
            group
            |> Map.put(:group_status, "investment")
            |> Map.update!(:round, fn round -> round + 1 end)
          end
			end

			group = Map.put(group, :voting, false)
      participants = Enum.reduce(group.members, data.participants, fn (id, acc) ->
        Map.update!(acc, id, fn participant ->
          %{ participant |
            voted: false,
            invested: data.max_round == now_group_round + 1,
            investment: 0,
            punished: false,
            punishment: 0,
          }
        end)
      end)
      data = data
      |> put_in([:groups, group_id], group)
			|> Map.put(:participants, participants)
			
			if Enum.all?(Map.keys(data.groups), fn g_id -> (data.groups[g_id].group_status == "finished") end) do
				data = Map.put(data,:page,"result")
			end

			data
    else
      group = Map.update!(group, :not_voted, fn x -> x - 1 end)
      data
      |> put_in([:groups, group_id], group)
    end
	end
	
	def get_filter(data, id) do
		group_id = data.participants[id].group
		status = if group_id, do: get_in(data, [:groups, group_id, :group_status]), else: nil
		if (data.page == "result"), do: status = "result"
		%{
			_default: true,
			participants: %{
				id => true
			},
			max_round: "maxRound",
			participants_number: "participantsNumber",
			punishment_rate: "punishmentRate",
			max_punishment: "maxPunishment",
			groups_number: false,
			finish_description_number: false,
			group_size: "groupSize",
			groups: %{
				group_id => %{
					members: true,
					group_status: "state",
					round: true,
					not_voted: "notVoted",
					investments: true,
					voting: true
				}
			},
			ask_student_id: "askStudentId",
			punishment_flag: "punishmentFlag",
			investment_log: (status == "finished" || status == "result"),
			punishment_log: false,
			is_first_visit: false,
			_spread: [[:participants, id], [:groups, group_id]],			
			profits_data: (status == "finished" || status == "result"),
			history: false,
			punish_history: false
		}
	end

	def filter_data(data, id) do
		Transmap.transform(data, get_filter(data, id), diff: false)
		|> Map.delete(:participants)
	end
end
