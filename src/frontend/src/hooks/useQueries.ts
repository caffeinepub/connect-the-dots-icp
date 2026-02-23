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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      const articles = await actor.getAllArticles();
      return articles;
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useAddArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url, thumbnail }: { title: string; url: string; thumbnail: ExternalBlob }) => {
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return await actor.addArticle(title, url, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add article');
      console.error('Add article error:', error);
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
      toast.success('Article updated successfully');
    },
    onError: () => {
      toast.error('Failed to update article');
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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getAllXPosts();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Post added successfully');
    },
    onError: () => {
      toast.error('Failed to add post');
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
      toast.success('Post updated successfully');
    },
    onError: () => {
      toast.error('Failed to update post');
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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getAllSpotlights();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Spotlight added successfully');
    },
    onError: () => {
      toast.error('Failed to add spotlight');
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
      toast.success('Spotlight updated successfully');
    },
    onError: () => {
      toast.error('Failed to update spotlight');
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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getAllWisdom();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Wisdom added successfully');
    },
    onError: () => {
      toast.error('Failed to add wisdom');
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
      toast.success('Wisdom updated successfully');
    },
    onError: () => {
      toast.error('Failed to update wisdom');
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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Resource added successfully');
    },
    onError: () => {
      toast.error('Failed to add resource');
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
      toast.success('Resource updated successfully');
    },
    onError: () => {
      toast.error('Failed to update resource');
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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getAllCybercrimeArticles();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Article added successfully');
    },
    onError: () => {
      toast.error('Failed to add article');
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
      toast.success('Article updated successfully');
    },
    onError: () => {
      toast.error('Failed to update article');
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
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getMissionContent();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Mission content updated successfully');
    },
    onError: () => {
      toast.error('Failed to update mission content');
    },
  });
}

// Home Page Links
export function useGetHomePageLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageLink[]>({
    queryKey: ['homePageLinks'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Backend connection not ready');
      }
      return actor.getAllHomePageLinks();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 1000,
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
      toast.success('Link added successfully');
    },
    onError: () => {
      toast.error('Failed to add link');
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
      toast.success('Link updated successfully');
    },
    onError: () => {
      toast.error('Failed to update link');
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
