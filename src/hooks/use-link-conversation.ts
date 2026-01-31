"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { projectApi } from "@/api/project/api";
import { handleApiError } from "@/lib/error-handler";
import { t } from "@/i18n";

interface UseLinkConversationOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useLinkConversation = (options?: UseLinkConversationOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const { error: showErrorToast, success: showSuccessToast } = useToast();

  const linkConversationToProject = useCallback(
    async (
      projectUuid: string,
      conversationUuid: string,
      token: string
    ): Promise<boolean> => {
      setIsLoading(true);
      try {
        const response = await projectApi.linkConversationToProject(
          projectUuid,
          conversationUuid
        );

        if (response.error) {
          const errorMessage = handleApiError(
            new Error(response.error),
            response.processedError
          );
          showErrorToast(
            t("chat.conversationMoveError"),
            errorMessage
          );
          options?.onError?.(errorMessage);
          return false;
        }

        showSuccessToast(t("chat.conversationMovedSuccess"));
        options?.onSuccess?.();
        return true;
      } catch (error) {
        const errorMessage = handleApiError(error);
        showErrorToast(
          t("chat.conversationMoveError"),
          errorMessage
        );
        options?.onError?.(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [showErrorToast, showSuccessToast, options]
  );

  return {
    linkConversationToProject,
    isLoading,
  };
};

