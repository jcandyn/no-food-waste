# no-food-waste

<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/jcandyn/no-food-waste">
    <img src="./public/assets/planet.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ZeroFoodWaste</h3>

  <p align="center">
    This is the final project for CS-546-WN1.
    <br />
    <br />
    <br />
    <a href="https://github.com/jcandyn/no-food-waste/issues">Report Bug</a>
    ·
    <a href="https://github.com/jcandyn/no-food-waste/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap the project.

- [![HandleBars][Handlebars.com]][Handlebars-url]
- [![Javascript][Javascript.com]][Javascript-url]
- [![Axios][Axios.com]][Axios-url]
- [![Node][Node.js.com]][Node.js-url]
- [![Express][Express.com]][Express-url]
- [![MongoDB][MongoDB.com]][MongoDB-url]
- [![D3js][D3js.com]][D3js-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]
- [![JQuery][JQuery.com]][JQuery-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [Unsplash](https://unsplash.com/documentation) and [Spoonacular](https://spoonacular.com/food-api)
2. Create a free Atlas MongoDB Database at [MongoDB](https://www.mongodb.com/atlas/database)
3. Clone the repo
   ```sh
   git clone https://github.com/jcandyn/no-food-waste.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Enter your API and MongoDB connection uri in a new `.env` file
   ```js
   DB_URI=mongodb+srv://username:passwrod@cluster.zzzzzzz.mongodb.net/?retryWrites=true&w=majority
   SPOONACULAR_API_KEY=myAPIkey343423434234dsfdsfsd
   UNSPLASH_API_KEY=myAPIkey3432423432432dfdsfdsf
   ```
6. Seed Database
   ```sh
   npm run seed
   ```
7. Run application
   ```sh
   npm run start
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Special thanks to:

- [Choose an Open Source License](https://choosealicense.com)
- [Img Shields](https://shields.io)
- [Best Read Me Template!](https://github.com/othneildrew/Best-README-Template)
- [GitHub Pages](https://pages.github.com)
- [Font Awesome](https://fontawesome.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/badge/Contributions-4-brightgreen.svg?style=for-the-badge
[contributors-url]: https://github.com/jcandyn/no-food-waste/graphs/contributors
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/jcandyn/no-food-waste/release/1.0.0/LICENSE.txt
[product-screenshot]: images/screenshot.png
[Express.com]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB-url]: https://www.mongodb.com/
[MongoDB.com]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[D3js-url]: https://d3js.org/
[D3js.com]: https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white
[Axios.com]: https://img.shields.io/badge/Axios-56A2D6?style=for-the-badge&logo=axios&logoColor=white
[Axios-url]: https://axios-http.com/
[Node.js.com]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/
[Javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Javascript.com]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[Handlebars.com]: https://img.shields.io/badge/Handlebars-F37726?style=for-the-badge&logo=handlebars&logoColor=white
[Handlebars-url]: https://handlebarsjs.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
