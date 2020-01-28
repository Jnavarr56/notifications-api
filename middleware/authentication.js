import axios from 'axios'

const authentication = authAPIUrl => {
	return (req, res, next) => {

		if (!req.token) 
			return res.status(400).send({ code: 'MISSING TOKEN ERROR' })
        

        const headers = {
            Authorization: `Bearer ${req.token}`
        }

		axios
			.get(authAPIUrl, { headers })
			.then(({ headers }) => {

                const newAuthCookie = headers['set-cookie']
                
				if (newAuthCookie) 
					res.setHeader('set-cookie', newAuthCookie)
                
                
				return next()
			})
			.catch(({ response }) => {
                if (response & response.status) {
                    return res.status(response.status).send(response.data)
                } 
                return res.status(401).send({ code: 'COULD NOT AUTHENTICATE REQUEST ERROR' })
			})
	}
}

export default authentication