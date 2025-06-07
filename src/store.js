import { createStore } from 'vuex';
import axios from 'axios';
import {getDateString} from "@/components/EventCalendar";

const getCurrentDate = () => {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const date = current.getDate();
    return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
};

const localStorage = window.localStorage;
let storedData = [];
let subscribe = '';

(function (){
    if(localStorage.getItem("Events")){
        storedData = JSON.parse(localStorage.getItem("Events"));    
        // console.log(storedData);
        
        storedData = storedData.filter((param)=>{
            // console.log(param);
            if(param.HOUSE_SECD === '01'){
                if(new Date(param.RCEPT_ENDDE) >= new Date(getCurrentDate())){
                    return param;
                }    
            }
            else{
                // console.log(param);
                if(new Date(param.SUBSCRPT_RCEPT_ENDDE) >= new Date(getCurrentDate())){
                    return param;
                }    
            }
            
        });
        // console.log(storedData);
        //데이터 로드시 이미 지난 이벤트는 제거한다.
    }
})();

const updateStorage = function(type,param){
    localStorage.setItem(type,JSON.stringify(param));
}

const store = createStore({
    state : {
        count : 0,
        response : [],
        category : 'APT',
        favorite: storedData,
        subscribe: subscribe,
        loadingbar : false,
        isError : false,
        area : '전체',
        isAlarm : false,
        isModalOpen: false,
    },
    getters: {
        increaseCount(state) {
            return ++state.count;
        },
        getResponse(state){
            return state.response;
        },
        getCategory(state){
            return state.category;
        },
        getFavorite(state){
            return state.favorite;
        },
        getSubscribe(state){
            return state.subscribe;
        },
        getEmail(state){
            return state.email;
        },
        getLoadingbar(state){
            return state.loadingbar;
        },
        getError(state){
            return state.isError;
        },
        getArea(state){
            return state.area;
        },
        getAlarm(state){
            return state.isAlarm;
        },
        getIsModalOpen(state){
            return state.isModalOpen;
        }
    },
    mutations : {
        addcounter : function(state, payload){
            // console.log(state);
            return state.count += payload.amount;
        },
        updateState : function(state, payload){
            return state.response = payload.response;
        },
        initialState : function(state){
            return state.response = [];
        },
        updateArea : function(state, payload){
            return state.area = payload.area;
        },
        updateCategory : function(state,payload){
            // console.log(payload.category);
            // state.response = [];
            return state.category = payload.category;
        },
        updateFavorite : function(state, payload){
            // console.log(payload);
            const duplicated = state.favorite.some(param => param.HOUSE_MANAGE_NO === payload.data.HOUSE_MANAGE_NO);
            if(!duplicated){
                state.favorite.push(payload.data);
                updateStorage('Events',state.favorite);
                return state.favorite;
            }
        },
        removeFavorite : function(state, payload){
            // console.log(payload.data.HOUSE_MANAGE_NO);
            state.favorite = state.favorite.filter((param) =>  param.HOUSE_MANAGE_NO !== payload.data.HOUSE_MANAGE_NO);
            // console.log("favorite",state.favorite);
            updateStorage('Events',state.favorite);

            return state.favorite;
        },
        setSubscribe : function(state,payload){
            state.subscribe = payload.data;
            updateStorage('Email',state.subscribe);
            return state.subscribe;
        },
        checkUser: function(data){
            console.log(data);
        },
        setLoadingbar : function(state){
            if(state.loadingbar){
                state.loadingbar = false;
            }else{
                state.loadingbar = true;
            }
        },
        setIsError : function(state,payload){
            state.isError = payload.isError;
        },
        setModal: function(state){
            if(state.isModalOpen){
                state.isModalOpen = false;
            }else{
                state.isModalOpen = true;
            }
        }
    },
    actions : {
        async getData({commit}){
            // console.log(this.state.category);
            commit('setLoadingbar');            
            return axios.get(`${import.meta.env.VITE_API_URL}/api/home/getInfo?category=${this.state.category}`).then(res =>{
                const { data } = res.data;
                commit('setLoadingbar');
                // console.log(data);
                if(!Array.isArray(data)){
                    if(Object.prototype.hasOwnProperty.call(data.data, 'msg')){
                        console.error('error happend!');
                        alert(data.data.msg);
                        return;
                    }
                }
                data.map((param)=>{
                    param.RCEPT_BGNDE = getDateString(param.RCEPT_BGNDE)
                    param.RCEPT_ENDDE = getDateString(param.RCEPT_ENDDE)
                    param.SUBSCRPT_RCEPT_BGNDE = getDateString(param.SUBSCRPT_RCEPT_BGNDE)
                    param.SUBSCRPT_RCEPT_ENDDE = getDateString(param.SUBSCRPT_RCEPT_ENDDE)
                })
                commit({
                    type : 'updateState',
                    response : data
                });
            }).catch((err)=>{
                console.error('Front End Part' ,err);
            })
        },
        async getPastData({commit},data){
            commit('setLoadingbar');            
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/home/getInfo?category=${this.state.category}&s_date=${data.s_date}&e_date=${data.e_date}`);
                commit('setLoadingbar');
                // console.log(res);
                const result = res.data.data.map((param)=>{
                    param.RCEPT_BGNDE = getDateString(param.RCEPT_BGNDE)
                    param.RCEPT_ENDDE = getDateString(param.RCEPT_ENDDE)
                    param.SUBSCRPT_RCEPT_BGNDE = getDateString(param.SUBSCRPT_RCEPT_BGNDE)
                    param.SUBSCRPT_RCEPT_ENDDE = getDateString(param.SUBSCRPT_RCEPT_ENDDE)
                    return param;
                });
                // let temp = this.state.response;
                const rawObject = Object.assign([], this.state.response);

                const remap = [ ...result , ...rawObject ].sort((a,b)=>a._id-b._id);
                const ids = new Set();
                [...remap].map(e=>ids.add(e._id));
                const resultMap = [...ids].map((_id)=> remap.filter(param=>param._id === _id)[0]);
                // console.log(resultMap);       
                commit({
                    type : 'updateState',
                    response : resultMap
                });
            }catch(e){
                console.error(e);
            }
        },
        updateCategory({commit,dispatch},data){
            commit('initialState');
            commit('updateCategory',data);
            dispatch('getData');
        },
        updateFavorite({commit},data){
            commit('updateFavorite',data);
        },
        removeFavorite({commit},data){
            commit('removeFavorite',data);
        },
        toggleLoadingbar({commit}){
            commit('setLoadingbar')
        },
        updateArea({commit},data){
            commit('updateArea',data);
        },
        setSubscribe({commit},data){
            commit('setSubscribe',data);
        },
        setIsError({commit},data){
            console.log(data);//error 건은 MQ로 보낸다.
            commit('setIsError',data);
        },
        setModal({commit}){
            commit('setModal');
        }
    }
});

export default store;
