import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Article, XPost, Spotlight, Wisdom, Resource, MissionContent, HomePageLink } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

// Latest Progress Articles
export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('[useGetAllArticles] Query function called', { actorReady: !!actor });
      if (!actor) {
        console.log('[useGetAllArticles] Actor not ready, returning empty array');
        return [];
      }
      const articles = await actor.getAllArticles();
      console.log('[useGetAllArticles] Fetched articles:', articles.length);
      return articles;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url, thumbnail }: { title: string; url: string; thumbnail: ExternalBlob }) => {
      console.log('[useAddArticle] Mutation function called', { 
        title, 
        url, 
        actorReady: !!actor,
        timestamp: new Date().toISOString()
      });
      
      if (!actor) {
        console.error('[useAddArticle] Actor not available');
        throw new Error('Backend connection not ready');
      }

      console.log('[useAddArticle] Calling actor.addArticle with params:', { title, url });
      const result = await actor.addArticle(title, url, thumbnail);
      console.log('[useAddArticle] Actor call completed', { result, timestamp: new Date().toISOString() });
      return result;
    },
    onSuccess: () => {
      console.log('[useAddArticle] Mutation succeeded, invalidating queries', { timestamp: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error) => {
      console.error('[useAddArticle] Mutation failed', { 
        error, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, url, thumbnail }: { id: string; title: string; url: string; thumbnail: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateArticle(id, title, url, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete article');
    },
  });
}

// X Posts
export function useGetAllXPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<XPost[]>({
    queryKey: ['xposts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllXPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddXPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ description, image }: { description: string; image: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.addXPost(description, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xposts'] });
    },
  });
}

export function useUpdateXPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, description, image }: { id: string; description: string; image: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateXPost(id, description, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xposts'] });
    },
  });
}

export function useDeleteXPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteXPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xposts'] });
      toast.success('Post deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });
}

// Ecosystem Spotlight
export function useGetAllSpotlights() {
  const { actor, isFetching } = useActor();

  return useQuery<Spotlight[]>({
    queryKey: ['spotlights'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSpotlights();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSpotlight() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, image, link }: { title: string; content: string; image: ExternalBlob | null; link: string | null }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.addSpotlight(title, content, image, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
    },
  });
}

export function useUpdateSpotlight() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content, image, link }: { id: string; title: string; content: string; image: ExternalBlob | null; link: string | null }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateSpotlight(id, title, content, image, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
    },
  });
}

export function useDeleteSpotlight() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteSpotlight(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
      toast.success('Spotlight deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete spotlight');
    },
  });
}

// Investing Wisdom
export function useGetAllWisdom() {
  const { actor, isFetching } = useActor();

  return useQuery<Wisdom[]>({
    queryKey: ['wisdom'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWisdom();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWisdom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quote, author }: { quote: string; author: string }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.addWisdom(quote, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wisdom'] });
    },
  });
}

export function useUpdateWisdom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quote, author }: { id: string; quote: string; author: string }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateWisdom(id, quote, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wisdom'] });
    },
  });
}

export function useDeleteWisdom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteWisdom(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wisdom'] });
      toast.success('Wisdom deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete wisdom');
    },
  });
}

// Trusted Resources
export function useGetAllResources() {
  const { actor, isFetching } = useActor();

  return useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, url }: { name: string; description: string; url: string }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.addResource(name, description, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useUpdateResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description, url }: { id: string; name: string; description: string; url: string }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateResource(id, name, description, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useDeleteResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteResource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete resource');
    },
  });
}

// Cybercrime Awareness
export function useGetAllCybercrimeArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['cybercrimeArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCybercrimeArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCybercrimeArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url, thumbnail }: { title: string; url: string; thumbnail: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.addCybercrimeArticle(title, url, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cybercrimeArticles'] });
    },
  });
}

export function useUpdateCybercrimeArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, url, thumbnail }: { id: string; title: string; url: string; thumbnail: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateCybercrimeArticle(id, title, url, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cybercrimeArticles'] });
    },
  });
}

export function useDeleteCybercrimeArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteCybercrimeArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cybercrimeArticles'] });
      toast.success('Article deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete article');
    },
  });
}

// Mission Content
export function useGetMissionContent() {
  const { actor, isFetching } = useActor();

  return useQuery<MissionContent | null>({
    queryKey: ['missionContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMissionContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateMissionContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, images }: { title: string; description: string; images: ExternalBlob[] }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateMissionContent(title, description, images);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missionContent'] });
    },
  });
}

// Home Page Links
export function useGetHomePageLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageLink[]>({
    queryKey: ['homePageLinks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHomePageLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHomePageLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url, thumbnail }: { title: string; url: string; thumbnail: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.addHomePageLink(title, url, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageLinks'] });
    },
  });
}

export function useUpdateHomePageLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, url, thumbnail }: { id: string; title: string; url: string; thumbnail: ExternalBlob }) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.updateHomePageLink(id, title, url, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageLinks'] });
    },
  });
}

export function useDeleteHomePageLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend connection not ready');
      return actor.deleteHomePageLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageLinks'] });
      toast.success('Link deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete link');
    },
  });
}
