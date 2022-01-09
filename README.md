<h2>NodeJS book recommendation engine.</h2>

<p>Web application that performes a user survey for logged in users and offers them book recommendations based on results of the survey</p>
<p>A simple project that shold have been a university task to learn to work in a team, but...</p>

<h3>Few words about used technologies</h3>
<p>Includes express, pino and typescript for back.</p>
<p>Includes angular, bulma, ngx-translate( may be unused ) for front.</p>
<p>Jest is used for testing both back and front</p>

<p>It is two package.json project. Backend package in the root, frontend pakcage in ./front</p>

<p>
    <ul>
    To use all project:
        <li>git clone [this]</li>
        <li>cd RecommendationProject</li>
        <li>git submodule init</li>
        <li>git submodule update</li>
        <li>cd ..</li>
        <li>docker-compose up -d</li>
    </ul>
<p>

<p>
    <ul>
    Stepst to build from scratch:
        <li>npm i</li>
        <li>npm --prefix=front i</li>
        <li>npm run all:build</li>
        <li>Launch mongodb on localhost:27017 without password</li>
        <li>npm run start</li>
    </ul>
<p>

<p>
    <ul>
    Prerequisites:
        <li>Node (preffered installation via nvm)</li>
        <li>npm (installed from linux package manager, updated via "npm install -g npm"</li>
        <li>Typescript (installed via "npm install -g typescript")</li>
        <li>Angular (installed via "npm install -g @angular/cli")</li>
        <li>Mongodb</li>
    </ul>
<p>




