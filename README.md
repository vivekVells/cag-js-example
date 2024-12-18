# CAG-JS Playground

![CAG-JS](https://img.shields.io/npm/v/cag-js)

This repository serves as a playground to validate and experiment with the [cag-js](https://www.npmjs.com/package/cag-js) library for efficient content processing within the browser. It provides a hands-on environment to test and explore the capabilities of cag-js, enabling developers to process large content inputs directly using Chrome's built-in Gemini Nano model.

## About

The cag-js playground is designed to help developers gain practical experience with cag-js and understand how it can be used to efficiently process large content inputs within the browser. By providing a set of example components and a user-friendly interface, the playground aims to showcase the power of cag-js in enabling sophisticated AI-powered content transformations without relying on external APIs.

## Features

- 🧩 Integration with the [cag-js](https://www.npmjs.com/package/cag-js) library for efficient content processing using Chrome's built-in Gemini Nano model.
- 📝 Example components showcasing content summarization, expansion, and multi-stage processing using cag-js.
- 🔍 Easy experimentation and validation of cag-js capabilities.

![CAG-JS Demo](/demo/humongous_data_set.png)

## Prerequisites

Before you begin, make sure you have the following:

- Node.js (recommended version 16.x or higher)
- npm (comes with Node.js)
- Google Chrome Canary (with Gemini Nano support)

<details>
<summary>Getting started with Gemini Nano and Chrome Canary</summary>

I'm sure you want to experiment with that too? Let's see how to proceed:

- First of all, you'll need to download Chrome Canary
- In `chrome://flags`, you must **enable** two experiments:
  - `Prompt API for Gemini Nano` and
  - `Enables optimization guide on device`.
- You'll have to restart the browser, after having enabled those two flags.

It may take quite a bit of time to download Gemini Nano (as it's a small model, it takes only around 1.7GB of space, but you'll need about 20GB at installation time on your hard drive) but the API will tell you if the model weights are not fully downloaded yet.

</details>

## Important Note

As of December 17, 2024, the built-in Gemini Nano model is only supported in the Canary version of the Chrome browser. To use cag-js and this playground, you need to have Google Chrome Canary installed. Additionally, you may need to enable AI usage in Chrome Canary by following the steps mentioned in the prerequisites section.

Please keep in mind that the availability and steps to enable AI usage in Chrome may change in the future.

## Getting Started

Follow these steps to get the playground up and running:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/cag-js-playground
    ```

2. **Navigate to the project folder:**

    ```bash
    cd cag-js-playground
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    This command will start the development server, allowing you to access the playground in your browser.

5. **Open the playground in Chrome Canary:**

    - Open the Google Chrome Canary browser.
    - Navigate to `http://localhost:3000` (or the URL provided by the development server).

6. **Explore the example components and experiment:**

    - The playground includes example components that demonstrate various cag-js functionalities, such as content summarization, expansion, and multi-stage processing.
    - Interact with the components to see how cag-js processes the content within the browser using Chrome's built-in Gemini Nano model.
    - Feel free to modify the code, try different inputs, and experiment with cag-js to validate its capabilities.

7. **Customize and build upon the playground:**

    - Use the playground as a starting point to build your own applications or integrate cag-js into your existing projects.
    - Modify the components and functionality to suit your specific requirements.
    - Leverage the cag-js library to implement your own content processing logic.

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions for improvements, or want to add more examples to the playground, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Support

⭐️ If you find this playground helpful, consider giving it a star on [GitHub](https://github.com/yourusername/cag-js-playground).

---

Happy experimenting and validating cag-js! If you have any questions or need further assistance, please don't hesitate to reach out.

---