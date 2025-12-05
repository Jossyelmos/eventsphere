const token = "63M_vgx2nlv1qX9sZxfwTsNMQm8C77Qmf6YSEARl";

function convertToJson(res) {
  if (!res.ok) {
    console.error("API ERROR:", res.status, res.statusText);
    return res.json().then(err => {
      console.error("Error body:", err);
      throw new Error(`Service error: ${res.status} ${res.statusText}`);
    });
  }
 
  return res.json();

}


export default class EventData {

  async getData() {
    const response = await fetch("https://api.predicthq.com/v1/events/?limit=50", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
    const data = await convertToJson(response);
    console.log(data.results);
    return data.results;
  }

  async findEventById(id) {
    const response = await fetch(`https://api.predicthq.com/v1/events/?id=${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });
    const data = await convertToJson(response);
    console.log(data.results[0]);
    
    return data.results[0];
  }

//   async checkout(payload) {
//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload)
//     }
//     return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
//   }
}