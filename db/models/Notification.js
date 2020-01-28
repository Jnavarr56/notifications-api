import { Schema, model } from 'mongoose'

const NotificationSchema = new Schema(
	{
		text: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		},
		image_uri: {
			type: String,
			default: null
		},
		type: {
			type: String,
			enum: [
				'ACCOUNT'
			],
			required: true
		},
		read: {
			type: Boolean,
			default: false
		},
		readAt: {
			type: Date,
			default: null
		}
	},
	{ timestamps: true }
)

export default model('Notification', NotificationSchema, 'Notification')
