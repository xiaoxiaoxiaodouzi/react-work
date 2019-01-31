import {base} from '../services/base'

/*
	props.authority   指定权限code
	props.permissions			所有权限code 未指定则从base取
	props.noMatch    不匹配返回的组件
*/
export default (props)=>{
	let permissions=props.permissions || base.allpermissions;
	if(permissions.includes(props.authority)){
		return props.children
	}else{
		return props.noMatch || ''
	}
};