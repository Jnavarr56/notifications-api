import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import bearerToken from 'express-bearer-token'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import aqp from 'api-query-params'
import cors from 'cors'
import { Notification } from './db/models'
import { checkForRequiredVars } from './utils/vars'
// import authentication from './middleware/authentication'

require('dotenv').config()

checkForRequiredVars([
	'PORT',
	'DB_URL',
	'NOTIFICATIONS_API',
	// 'AUTHENTICATION_API'
])

const { 
	// GATEWAY_BASE_URL, 
	CORS, 
	PORT, 
	DB_URL, 
	NOTIFICATIONS_API, 
	// AUTHENTICATION_API 
} = process.env


const app = express()
if (CORS) app.use(cors())

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(cookieParser())
	.use(bearerToken())
	// .use(authentication(GATEWAY_BASE_URL + AUTHENTICATION_API + '/authorize'))
	.use(morgan('dev'))

app.get(NOTIFICATIONS_API, (req, res) => {
	const dbQueryValues = aqp(req.query)
	const { limit, skip, sort, filter, population } = dbQueryValues

	Notification.find(filter)
		.limit(limit)
		.skip(skip)
		.sort(sort)
		.populate(population)
		.exec((error, query_results) => {
			if (error) return res.status(500).send({ error })
			res.send({ query_results })
		})
})

app.get(`${NOTIFICATIONS_API}/:notification_id`, (req, res) => {
	Notification.findById(req.params.user_id, (error, user) => {
		if (error) return res.status(500).send({ error })
		res.send({ user })
	})
})

app.post(NOTIFICATIONS_API, (req, res) => {
	const { code, ...newNotificationData } = req.body

	User.create({ ...newNotificationData }, (error, new_notification) => {
		if (error) return res.status(500).send({ error })

		if (!new_notification)
			return res
				.status(500)
				.send({ error: 'Problem Retrieving Newly Created Notification' })

		res.send({ new_notification })
	})
})

app.patch(`${NOTIFICATIONS_API}/:notification_id`, (req, res) => {
	const { code, ...updatedNotificationData } = req.body
	Notification.findByIdAndUpdate(
		req.params.notification_id,
		{ ...updatedNotificationData },
		{ new: true, runValidators: true },
		(error, updated_notification) => {
			if (error) return res.status(500).send({ error })

			if (!updated_notification)
				return res
					.status(500)
					.send({ error: 'Problem Retrieving Updated Notification' })

			res.send({ updated_notification })
		}
	)
})

app.delete(`${NOTIFICATIONS_API}/:notification_id`, (req, res) => {
	Notification.findByIdAndDelete(req.params.Notification_id, (error, deleted_Notification) => {
		if (error) return res.status(500).send({ error })

		if (!deleted_Notification)
			return res.status(500).send({ error: 'Problem Retrieving Deleted Notification' })

		res.send({ deleted_notification })
	})
})

const dbOpts = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(`${DB_URL}/notifications-api`, dbOpts, () => {
	app.listen(PORT, () => {
		console.log(`Notifications API running on PORT ${PORT}!`)
	})
})
