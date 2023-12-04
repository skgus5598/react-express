import { useNavigate, useLocation } from "react-router-dom";
import avatar from '../../img/chicken.png';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { cities, londonTowns, manchesterTowns } from '../SelectAreaObj';

const Profile = () => {

    let navigate = useNavigate();
    const [userInfo, setUserInfo] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [town, setTown] = useState('');
    let user = useSelector((state) => state.persistedReducer.user_rd);

    useEffect(() => {
        axios.get(`http://localhost:5000/getUserInfo/${user.userNo}`)
            .then((res) => {
                console.log('get profile success : ' + JSON.stringify(res.data));
                setUserInfo(res.data) // for comparing values
                setNickname(res.data.nickname);
                setEmail(res.data.userEmail);
                setCity(res.data.userRegion);
                setTown(res.data.userArea);
            })
            .catch((e) => { console.log(e) });
    }, []);

    const onChangeCityHandler=(e)=>{
        setCity(e.currentTarget.value);
    }
    const onChangeTownHandler=(e)=>{
        setTown(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        axios.put('http://localhost:5000/updateUser', {
            userNo : user.userNo,
            nickname : nickname,
            email : email,
            city : city,
            town : town
        },
        { headers : {"Content-Type" : "application/json"} }
        ).then(res => {
            if(res.data.success){
                alert('Saved!');      
            }else{ alert("Modify Fail" )} 
        }).catch((e) => {  alert("Server ERROR " , e )   })      
    }

    return (
        <div className="detailContainer" >
            <div className='mypage_headmenu' onClick={() => { navigate(-1) }} >
                <div>
                    <h5>Profile</h5>
                    <img src={avatar} />
                </div>
            </div>
            <div className="profile_form">
                <Form onSubmit={onSubmitHandler}>
                    <Form.Group>
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={user.userId || ''} readOnly />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>NICKNAME</Form.Label>
                        <Form.Control type="text" id="nickname" value={nickname || ''} onChange={(e) => { setNickname(e.target.value) }} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>EMAIL</Form.Label>
                        <Form.Control type="email" id="email" value={email || ''} onChange={(e) => { setEmail(e.target.value) }} />
                    </Form.Group>

                    <Form.Label>CITY</Form.Label>
                    <Form.Select onChange={onChangeCityHandler} id="city" value={city}>
                        {cities.map((item, index) => (
                            <option key={item.key} value={item.value}>{item.value}</option>
                        ))}
                    </Form.Select>  <br />

                    <Form.Label>TOWN</Form.Label>
                    <Form.Select onChange={onChangeTownHandler} id="town" value={town}>
                        {
                            city == 'London(Greater London)'
                                ?
                                londonTowns.map((item, index) => (
                                    <option key={item.key} value={item.value}>{item.value}</option>
                                ))
                                : manchesterTowns.map((item, index) => (
                                    <option key={item.key} value={item.value}>{item.value}</option>
                                ))
                        }
                    </Form.Select>
                    <br />
                    {
                        (nickname == userInfo.nickname && 
                         email == userInfo.userEmail &&
                         city == userInfo.userRegion &&
                         town == userInfo.userArea
                        )
                        ? <button className="profile_save_btn_ds" type="submit" disabled> SAVE </button>
                        : <button className="profile_save_btn" type="submit"> SAVE </button>
                    }
                </Form>
            </div>

        </div>

    )
}

export default Profile;