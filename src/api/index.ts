import * as profileDetail from '@/api/profile';
import * as tagsCard from '@/api/tags-card';
import * as Notice from '@/api/notice-board';
import * as Article from '@/api/article';
import * as Achieve from '@/api/achieve';
import * as Wiki from '@/api/wiki';
import * as Login from '@/api/login';

export default class API {
  static profileDetail = profileDetail;
  static tagsCard = tagsCard;
  static Notice = Notice;
  static Article = Article;
  static Achieve = Achieve;
  static Wiki = Wiki;
  static Login = Login;
}
