const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('X-User-Token', localStorage.getItem('token'));
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
async function SetPutObj(data){
  var putBody = new Object;
  putBody = {
    "event_calendar": {
        "status": data.status,
        "apartment_id": data.apartment_id,
        "realty_room_id": data.realty_room_id,
        "begin_date": data.begin_date,
        "end_date": data.end_date,
        "arrival_time": data.arrival_time,
        "departure_time": data.departure_time,
        "amount": data.amount,
        "notes": data.notes,
        "color": data.color,
        "reaction": data.reaction,
        "source_id": data.source_id,
        "client": {
            "id": data.client.id,
            "fio": data.client.fio,
            "email": data.client.email,
            "phone": data.client.phone,
            "additional_phone": data.client.additional_phone
        },
        "attachments": []
    },
    "prepaid_amount": data.prepaid_amount,
    "send_confirm_email": data.send_confirm_email,
    "send_link_prepaid": data.send_link_prepaid,
    "destroy_attachments_ids": []
    };
  //_____________________________________________________________________//
  return putBody;
}
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
const plaformCommission = async (data) => {
  const response = await fetch("http://185.159.130.194/paltform_list.json");
  const outData = await response.json();
  const commisionsList = Array(outData.sources_list)[0];
  for(let i=0; i<commisionsList.length;i++)
  {
    if(commisionsList[i].id == data.source_id)
      {
        return(commisionsList[i].commission)
      }
  }
  return false; 
  }
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
const getData = async (eventId) => {
  const response = await fetch("https://realtycalendar.ru/v2/event_calendars/"+eventId,
  {
    method: 'GET',
    headers: myHeaders,
  }
  );
  const data = await response.json();
  //getDataGlobal = data;
  return data;
};
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
const setData = async (json,eventId) => {
  console.log(json);
  const response = await fetch("https://realtycalendar.ru/v2/event_calendars/"+eventId,
  {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(json),
  }
  );
  const data = await response.json();
  return data;
};
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
function colIdOut() {
  const elem = document.getElementsByClassName("type-event");
  let id_list = new Array;
  for(let i=0;i<elem.length;i++){
    id_list.push(elem[i].dataset.colId);
  }
  return id_list;
}
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//--------------------------------------MAIN----------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////
const start = async () => {
  let idlist = colIdOut();
  // console.log(idlist.length);
  for(let i=0;i<idlist.length;i++){
    let getDataGlobal = await getData(idlist[i]);
    //console.log((getDataGlobal.notes).toLocaleLowerCase().includes("комиссия"));
    //console.log(getDataGlobal)
    //console.log()
    //console.log()
    if((await getDataGlobal.notes)==null||!((await getDataGlobal.notes).includes("[changed]"))) //||(getDataGlobal.notes).toLocaleLowerCase().includes("комиссия")))
    {
      console.log((getDataGlobal.notes));
      let comiss = (getDataGlobal.amount/100*await plaformCommission(getDataGlobal));
      getDataGlobal.amount-=comiss;
      if((await getDataGlobal.notes)==null){
        getDataGlobal.notes="\n[changed]"+" комиссия-"+comiss+"₽";
      }
      else{
        getDataGlobal.notes+="\n[changed]"+" комиссия-"+comiss+"₽"; 
      }
      setData(await SetPutObj(getDataGlobal),idlist[i]);
    }
  }
};

start();
//////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////////