import React, {useState} from 'react'

interface MyButtonProps{
    text : string | number | boolean;
    onClick?: () => void
}

interface Book{
    name : string,
    price : number
}
/*

/*
 then npm run dev


 aryyy terminal bhi share ho sakta hai
 ek baat bata, hum call pe kyu nahi arhe, what yaaar antu the tamatar girl
call karo fir bleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeh
*/



const myButton : React.FC<MyButtonProps> = (props)=>{
    const [value, setValue] = useState<Book>({
        name : "kim jn",
        price : 10
    });
    return(
        <>
            <h1>ANUSHKAAAAAA, kaise hooo, project live update hora?</h1>
            <button onClick={()=>{setValue({name: "kim jong antu" , price: 20})}}>
                {`Name: ${value.name} price: ${value.price}`}</button>
        </>
    )
}

export default myButton