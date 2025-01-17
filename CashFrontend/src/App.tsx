import './App.css'
import UserList from './components/listUsers'

function App() {

  return (
    <div>
      <h1 className="text-3xl text-emerald-700 font-bold underline">
        Hello world!
      </h1>
      <button className="btn btn-primary">Button</button>
      <UserList />
    </div>
  )
}

export default App
