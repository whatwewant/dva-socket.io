/**
* @Author: eason
* @Date:   2017-07-19T18:32:34+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-07-23T18:00:33+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import createSocketPlugin from './dva-plugin';

export default createSocketPlugin;

export { createMiddleware, createListeners, createEmiters, createAsyncs } from './middleware';
