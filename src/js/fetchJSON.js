export default async function fetchJSON(url, requestOptions = {}){
    requestOptions = {...requestOptions, 
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    }

    const response = await fetch(url, requestOptions)

    const data = await response.json();

    return data;
}