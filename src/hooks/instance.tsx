import axios from 'axios'


export const instance = axios.create({
  baseURL: "http://18.196.125.229/api" 
})  