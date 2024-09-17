import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'public'));

let posts = [];

app.get('/', (req, res) => {
    res.render('index'); 
});


app.post('/submit', (req, res) => {
    const { name, story } = req.body;
    posts.push({ name, story });
    res.redirect('/posts');
});

app.get('/posts', (req, res) => {
    res.render('posts', { posts });
});

app.get('/edit/:index', (req, res) => {
    const postIndex = req.params.index;
    const post = posts[postIndex];
    if (post) {
        res.render('edit', { post, index: postIndex }); 
        res.status(404).send('Post not found');
    }
});

app.post('/update/:index', (req, res) => {
    const postIndex = req.params.index;
    const { name, story } = req.body;
    if (posts[postIndex]) {
        posts[postIndex] = { name, story };
        res.redirect('/posts');
    } 
    else {
        res.status(404).send('Post not found');
    }
});

app.post('/delete/:index', (req, res) => {
    const postIndex = req.params.index;
    if (posts[postIndex]) {
        posts.splice(postIndex, 1);
        res.redirect('/posts');
    } 
    else {
        res.status(404).send('Post not found');
    }
});

// callback function with port
app.listen(port, () => {
    console.log('Server running on port ${port}.');
});

