import { h, render } from "preact"
import logo from "./logo.png"
import "./index.css"

const App = () => (
  <main>
    <header>
      <img src={logo} class="logo" alt="logo" />
      <div>Ola mundo</div>
    </header>
  </main>
)

render(<App />, document.body)
