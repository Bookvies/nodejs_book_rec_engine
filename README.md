<h3>Quick start project for nodejs back and angular front.</h3>
<p>Includes express, pino and typescript for back.</p>
<p>Includes angular, bulma, ngx-translate for front.</p>
<p>Jest is used for testing both back and front</p>

<p>It is two package.json project. Backend package in the root, frontend pakcage in ./front</p>

<p>
    <ul>
    Stepst to build from scratch:
        <li>npm i</li>
        <li>npm --prefix=front i</li>
        <li>npm run all:build</li>
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
    </ul>
<p>


<p>To add new translation, create .json file in ./front/assets/i18n/ and include it in ./front/src/app/translate-universal-loader.service.ts like others</p>

