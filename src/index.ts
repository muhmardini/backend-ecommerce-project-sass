import {app} from './app.ts'
import {env} from './shared/env.ts'

app.listen(env.PORT, () => {
    console.log(`Server is running on Port ${env.PORT} in ${env.NODE_ENV} mode`);
    
})