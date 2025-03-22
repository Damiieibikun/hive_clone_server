const express = require('express');
const connectDatabase = require('./config/databaseConfig');
const app = express();
const {config} = require('./config/config')
const cors = require('cors');
const user_routes = require('./routes/userRoutes');
const category_routes = require('./routes/categoryRoutes');
const post_routes = require('./routes/postRoutes');
const comments_routes = require('./routes/commentsRoutes');
const likes_route = require('./routes/likesRoutes')

const path = require('path');
app.use(cors({
    origin: 'https://hive-clone.onrender.com', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));
  
    app.options('*', cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send('Welcome to Hive blog API')
})

app.use('/api/hiveblog/users', user_routes )
app.use('/api/hiveblog/categories', category_routes )
app.use('/api/hiveblog/posts', post_routes )
app.use('/api/hiveblog/comments', comments_routes )
app.use('/api/hiveblog/likes', likes_route )

app.listen(config.port, ()=>{
    console.log('Server connected successfully!')
    connectDatabase();
})
