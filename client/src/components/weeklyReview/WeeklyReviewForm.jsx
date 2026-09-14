import { useForm } from "react-hook-form";
import { inputClasses, labelClasses } from "../../utils/formStyles.js";
import SubmitButton from "../common/SubmitButton.jsx";

/** Only the qualitative reflection fields are editable here - the numeric
 * stats are always the live, real database numbers (see WeeklyReview.jsx),
 * so a saved review can never show fabricated statistics. */
const WeeklyReviewForm = ({ defaultValues, onSubmit, isSubmitting }) => {
  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClasses}>Achievements</label>
        <textarea
          rows={3}
          className={inputClasses}
          placeholder="What went well this week?"
          {...register("achievements")}
        />
      </div>
      <div>
        <label className={labelClasses}>Challenges</label>
        <textarea
          rows={3}
          className={inputClasses}
          placeholder="What was difficult?"
          {...register("challenges")}
        />
      </div>
      <div>
        <label className={labelClasses}>What needs improvement</label>
        <textarea rows={3} className={inputClasses} {...register("improvements")} />
      </div>
      <div>
        <label className={labelClasses}>Next week's plan</label>
        <textarea rows={3} className={inputClasses} {...register("nextWeekPlan")} />
      </div>
      <SubmitButton isSubmitting={isSubmitting}>Save review</SubmitButton>
    </form>
  );
};

export default WeeklyReviewForm;
