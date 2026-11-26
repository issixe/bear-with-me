import { useCallback, useState } from "react";
import { useServices } from "../context/ServicesContext";

const IDLE = { status: "idle", message: "" };

export function useAddLesson() {
  const { lessonService } = useServices();
  const [state, setState] = useState(IDLE);

  const uploadLessonFile = useCallback(
    async (file) => {
      if (!file) return; // user cancelled the file picker

      setState({ status: "uploading", message: "Uploading…" });

      let lesson;
      try {
        lesson = JSON.parse(await file.text());
      } catch {
        setState({
          status: "error",
          message: `"${file.name}" isn't valid JSON.`,
        });
        return;
      }

      try {
        const { lessonId } = await lessonService.create(lesson);
        setState({
          status: "success",
          message: `Lesson "${lessonId}" added to Custom Lessons.`,
        });
      } catch (error) {
        setState({ status: "error", message: error.message });
      }
    },
    [lessonService],
  );

  const reset = useCallback(() => setState(IDLE), []);

  return {
    ...state,
    uploading: state.status === "uploading",
    uploadLessonFile,
    reset,
  };
}
