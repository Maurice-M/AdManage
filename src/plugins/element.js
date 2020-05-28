import Vue from 'vue'
import { Button, Form, FormItem, Input, Icon, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Tooltip, Dialog, Select, Option, MessageBox, Tag, Tree, Pagination, Alert, DatePicker, Upload, Rate } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Icon).use(Container).use(Aside).use(Main).use(Header).use(Menu).use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).use(TableColumn).use(Table).use(Tooltip).use(Dialog).use(Select).use(Option).use(Tag).use(Tree).use(Pagination).use(Alert).use(DatePicker).use(Upload).use(Rate)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
