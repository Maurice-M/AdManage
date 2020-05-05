import Vue from 'vue'
import { Button, Form, FormItem, Input, Icon, Message } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Icon)

Vue.prototype.$message = Message
