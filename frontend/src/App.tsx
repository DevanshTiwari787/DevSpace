import MyButton from './components/buttons'
export default function App(){
  return(<>
    <MyButton text="click me" onClick={()=>{alert("this is an alert message")}}/>
  
  </>)
}