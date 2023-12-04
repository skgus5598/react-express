import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { cities, londonTowns, manchesterTowns } from './SelectAreaObj';

const MoreProducts = () => {
  let navigate = useNavigate();
  let [data, setData] = useState([]);

  const [city, setCity] = useState('');
  const [town, setTown] = useState('');

  useEffect( () => {
    async function getAllProducts(){
      const result = await axios.get('http://localhost:5000/getList', {
        headers : {"Content-Type" : "application/json"}
      }).then( (res => {
        console.log("res.data : " + JSON.stringify(res.data));
        setData(res.data)
      })).catch((err) => {
        console.log("axios err : " +  err)
      })
    }
    getAllProducts();
  }, []);


  const onChangeCityHandler=(e)=>{
      setCity(e.currentTarget.value);
      let param = e.currentTarget.value;
      console.log("city  : " + param);
      getListByParam(param);
  }
  const onChangeTownHandler=(e)=>{
      setTown(e.currentTarget.value);
      let param = e.currentTarget.value;
      console.log("town  : " + param);
      getListByParam(param)
  }

  const getListByParam = (param) => {
      axios.get(`http://localhost:5000/getListByCity/${param}`)
      .then((res) => { 
          console.log("res ::" + res.data);
          setData(res.data);
      })
      .catch((e) => console.log(e));
  }

    return(
        <>
        <div style={{ textAlign: "center", marginTop: "5%", marginBottom: "3%" }}><h1>Popular Items</h1></div>
            <div className='selectBox'>
                <nav>
                    <select onChange={onChangeCityHandler} id="city" value={city}>
                        <option  value="0">ALL</option>
                        {cities.map((item, index) => (
                            <option key={item.key} value={item.value}>{item.value}</option>
                        ))}
                    </select>
                    <select onChange={onChangeTownHandler} id="town" value={town}>
                          <option  value="0">ALL</option>
                        {
                            city == ''
                                ? <></>
                                : (city == 'London(Greater London)'
                                    ?
                                    londonTowns.map((item, index) => (
                                        <option key={item.key} value={item.value}>{item.value}</option>
                                    ))
                                    : manchesterTowns.map((item, index) => (
                                        <option key={item.key} value={item.value}>{item.value}</option>
                                    ))
                                )
                        }
                    </select>
                </nav>
            </div>
        <div className='Allproducts'>
          
          <br/>
          <div className='cardsWrap'>
            {
              data.map( (e, i) => {
                return(
                  <article key={i} className='card'>
                    <a className='cardLink' onClick={(e) => {
                          window.scrollTo({
                              top: 0,
                              behavior: 'smooth'
                        })
                        return navigate('/detail', {state : data[i]})}}>
                      <div className='cardPhoto'>
                        {/* <img src='https://codingapple1.github.io/shop/shoes1.jpg' /> */}
                        <img src={`http://localhost:5000/images/${e.imgName}`} />
                      </div>
                      <div className='cardDesc'>
                        <h3 className='cardTitle'>{e.pd_title}</h3>
                        <div className='cardPrice'>£{e.pd_price}</div>
                        <div className='cardRegion'>{e.userRegion}, {e.userArea}</div>
                        <span className='likeSpan'>like 30∙click 189</span>
                      </div>
                    </a>
                  </article>
                )
              })
            }
          </div>
        </div>
        </>
    )
}

export default MoreProducts;