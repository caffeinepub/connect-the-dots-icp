import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

import Storage "blob-storage/Storage";

module {
  type Article = {
    id : Text;
    title : Text;
    url : Text;
    timestamp : Time.Time;
    thumbnail : Storage.ExternalBlob;
  };

  type XPost = {
    id : Text;
    description : Text;
    image : Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type Spotlight = {
    id : Text;
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    link : ?Text;
  };

  type Wisdom = {
    id : Text;
    quote : Text;
    author : Text;
    timestamp : Time.Time;
  };

  type Resource = {
    id : Text;
    name : Text;
    description : Text;
    url : Text;
  };

  type MissionContent = {
    title : Text;
    description : Text;
    images : [Storage.ExternalBlob];
  };

  type OldActor = {
    articles : Map.Map<Text, Article>;
    xPosts : Map.Map<Text, XPost>;
    spotlights : Map.Map<Text, Spotlight>;
    wisdomEntries : Map.Map<Text, Wisdom>;
    resources : Map.Map<Text, Resource>;
    cybercrimeArticles : Map.Map<Text, Article>;
    missionContent : ?MissionContent;
  };

  type HomePageLink = {
    id : Text;
    title : Text;
    url : Text;
    thumbnail : Storage.ExternalBlob;
  };

  type NewActor = {
    articles : Map.Map<Text, Article>;
    xPosts : Map.Map<Text, XPost>;
    spotlights : Map.Map<Text, Spotlight>;
    wisdomEntries : Map.Map<Text, Wisdom>;
    resources : Map.Map<Text, Resource>;
    cybercrimeArticles : Map.Map<Text, Article>;
    missionContent : ?MissionContent;
    homePageLinks : Map.Map<Text, HomePageLink>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      homePageLinks = Map.empty<Text, HomePageLink>()
    };
  };
};
