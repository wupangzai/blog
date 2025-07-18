import * as profileDetail from '@/api/profile';
import * as tagsCard from '@/api/tags-card';
import * as Notice from '@/api/notice-board';
import * as Article from '@/api/article';

export default class API {
  static profileDetail = profileDetail;
  static tagsCard = tagsCard;
  static Notice = Notice;
  static Article = Article;
}
