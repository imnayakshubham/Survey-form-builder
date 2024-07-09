import { useNavigate } from "react-router-dom"
import { surveys } from "../../constant"

export const SurveysListPage = () => {
    const navigateTo = useNavigate()
    return (
        <div className="p-2">
            <div className="flex gap-2 flex-col">

                <h1 className="font-extrabold text-4xl">Surveys</h1>
                <div className="border-b-2 w-full"></div>
                <div className='flex gap-2 p-2 items-center w-full'>
                    {
                        surveys.map((survey) => {
                            return <div
                                key={survey.guid}
                                className='p-2 border-2 rounded-lg cursor-pointer'
                                onClick={() => navigateTo(`/survey/${survey.guid}`, { state: survey })}
                            >
                                <div className="flex gap-3 flex-col p-4">
                                    <div className="font-bold text-xl">{survey.name}</div>
                                    <div className="text-gray-500">{survey.company}</div>
                                </div>
                            </div>
                        })
                    }
                </div>

            </div>

        </div>
    )
}
