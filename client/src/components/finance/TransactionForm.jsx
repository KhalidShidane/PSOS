import { useForm } from "react-hook-form";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../utils/financeHelpers.js";
import SubmitButton from "../common/SubmitButton.jsx";

const TransactionForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel = "Save" }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const type = watch("type");
  const categoryOptions = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const submit = (data) => {
    onSubmit({ ...data, amount: Number(data.amount), date: new Date(data.date) });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Type</label>
          <select className={inputClasses} {...register("type", { required: true })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClasses}
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
          {errors.amount && <p className={errorClasses}>{errors.amount.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Category</label>
          <select className={inputClasses} {...register("category")}>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Date</label>
          <input
            type="date"
            className={inputClasses}
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Description (optional)</label>
        <input className={inputClasses} {...register("description")} />
      </div>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
};

export default TransactionForm;
