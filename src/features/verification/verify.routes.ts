import express from 'express'

const route = express.Router();

route.get('/admin/verification/users')

route.get('/admin/verification/requests')

route.post('/admin/verify/approve-reject')
