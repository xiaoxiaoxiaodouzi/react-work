
import fetchMock from 'fetch-mock';
import mockData from './index'

//如果要关闭mock数据，配置为'always'
fetchMock.config = Object.assign(fetchMock.config, {
  fallbackToNetwork : 'always',//'always',true
  // overwriteRoutes:true
});

mockData.forEach(md=>{
  if(md){
    fetchMock.mock({name:md.name,matcher:md.url,response:md.data,method:md.method});
  }
})

// fetchMock.restore();