def cron_sched(num_minutes=79):
	now = datetime.datetime.today()
	start_time = datetime.datetime(now.year, now.month, now.day, now.hour+1)
	additional_times = [start_time + (datetime.timedelta(minutes=79)*x) for x in range(1,18+1)]
	print start_time
	for each_time in additional_times:
		print each_time