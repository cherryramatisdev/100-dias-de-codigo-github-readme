'use strict';

const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.get('/', async (req, res) => {
	const user = req.query.username;

	if (!user) {
		return;
	}

	try {
		const response = await fetch(`http://20.201.112.54:8001/api/users/find/${user}`).then(data => data.json());

		res.setHeader('content-type', 'image/svg+xml; charset=utf-8');
		res.setHeader('cache-control', 'no-cache, max-age=0');

		res.render('index', {
			finishedDays: response.days_participated || 0,
			daysFinishedPercentage: response.days_participated ? (response.days_participated / 100) * 250 : 0,
			name: response.name || '',
			totalLikes: response.statistics.total_likes || 0,
			totalViews: response.statistics.total_views || 0,
			totalReplies: response.statistics.total_replies || 0,
			maxStreak: response.statistics.max_streak || 0,
		});
	} catch (error) {
		console.error(error);
	}
});

const port = process.env.NODE_ENV || 3000;

app.listen(port, () => console.log(`Server running on ${port}`));
