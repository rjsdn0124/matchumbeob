import re
from datetime import datetime

# 구 이름 떼기
def gu_control(keywords, line):
    for keyword in keywords:
        gu=keyword[0].split()[1]
        if keyword[0] in line:
            if keyword[1]:
                line = line.replace(keyword[0], "구")
            else:
                keyword[1] = True
                start_index = line.find(keyword[0])
                l = len(keyword[0])
                line = line[:start_index+l] + line[start_index+l:].replace(keyword[0], "구")
                line = line[:start_index+l] + line[start_index+l:].replace(gu, "구")
                continue

        if gu in line:
            if keyword[1]:
                line = line.replace(gu, "구")
            else:
                keyword[1] = True
                start_index = line.find(gu)
                l = len(gu)
                line = line[:start_index+l] + line[start_index+l:].replace(gu, "구")
    return line

# 단어 변환
def replace(line):
    line = line.replace("하여", "해")
    line = line.replace("하였다", "했다")
    line = line.replace("되어", "돼")
    line = line.replace("되었다", "됐다")
    line = line.replace("하였습니다", "했습니다")
    line = line.replace("되었습니다", "됐습니다")
    line = line.replace("라고", "고")
    line = line.replace("광역시", "시")
    line = line.replace("만 원", "만원")
    line = line.replace("천 원", "천원")
    line = line.replace("억 원", "억원")
    line = line.replace("되었으며", "됐으며")
    line = line.replace("하였으며", "했으며")
    line = line.replace("전했다", "밝혔다")
    line = line.replace("라면서", "라며")
    line = line.replace("라고", "고")
    line = line.replace("구청장", "청장")
    line = line.replace("특히,", "특히")
    line = line.replace("또,", "또")
    line = line.replace("또한,", "또한")
    line = line.replace("다음달", "내달")
    line = line.replace("△", "▲")
    return line

# 괄호 안이랑 괄호 삭제
def remove_goalho(line):
    while "(" in line:
            start_index = line.find("(")
            end_index = line.find(")")
            if start_index != -1 and end_index != -1:
                line = line[:start_index] + line[end_index + 1:]
    return line

# 조억만으로 만들어줘여ㅛ
def num_to_kor(num_group):
    num = num_group.group()
    leng = len(num)
    result = ""
    if leng > 12:
        temp = int(num[:-12])
        if temp != 0:
            result+=str(temp) + "조"
        num = num[-12:]
    if leng > 8:
        temp = int(num[:-8])
        if temp != 0:
            result+=str(temp) + "억"
        num = num[-8:]
    if leng > 4:
        temp = int(num[:-4])
        if temp != 0:
            result+=str(temp) + "만"
        num = num[-4:]
    temp = int(num)
    if temp != 0:
        result += str(temp)
    return result

def change_next_month_kor_ver(line):
    now_month = int(datetime.today().month) 
    next_month = now_month + 1 if now_month // 12 == 0 else 1
    line = line.replace(str(now_month)+"월", "이달")
    line = line.replace(str(next_month)+"월", "내달")

    return line

# 여기서 모든 규칙들 실행해준다잉.
def convert_press_release_to_article(press_release):
    # 규칙 1: "[충청신문=대전] 윤지현 기자 ="를 맨 앞에 붙이기
    press_release[0] = "[충청신문=대전] 윤지현 기자 = " + press_release[0]
    keywords = [["대전 서구", False], ["대전 유성구", False], ["대전 동구", False], ["대전 대덕구", False], ["대전 중구", False]]

    for i in range(len(press_release)):
        # 규칙 2: 대전 서구, 유성구, 동구, 대덕구, 중구가 나오면 다음 나오는 서구, 유성구, 동구, 대덕구, 중구는 "구"로 변경
        press_release[i] = gu_control(keywords, press_release[i])

        # 규칙 3: 특정 단어 치환
        press_release[i] = replace(press_release[i])
        
        # 규칙 4: 괄호 안 내용 제거
        press_release[i] = remove_goalho(press_release[i])

        # 규칙 6: 숫자에 ',' 빼기
        press_release[i] = re.sub(r'(?<=\d),(?=\d)', '', press_release[i])

        # 규칙 7: 억 만 단위로 나누기
        press_release[i] = re.sub(r'[0-9]+', num_to_kor, press_release[i])

        # 규칙 9: 이달 내달
        press_release[i] = change_next_month_kor_ver(press_release[i])

    # 변환된 기사 반환
    return press_release

# 보도자료 내용 입력 처리.
press_release = []
while True:
    line = input()
    
    if not line:
        break
    
    press_release.append(line)

# 변환된 기사 출력
article = "\n\n".join(convert_press_release_to_article(press_release))
print(article)
