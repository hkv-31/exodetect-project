export function useToast() {
  return {
    toast: ({
      title,
      description
    }: {
      title: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      const msg = description ? `${title}\n\n${description}` : title;
      window.alert(msg);
    }
  };
}
